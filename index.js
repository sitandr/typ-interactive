import init, { set_request_f, js_recompile, update_file, set_cache_size } from './typst-interactive.js';

const encoder =  new TextEncoder();
let inputs = {input: "", timer: 0, pressed_key: null};
// variables that are reset after each recompile
let temp_inputs = {};
let currently_recompiling = false;
let update_needed = false;

// stores current timer setInterval to clear it when it is changed
let timer_id = null;
// current time value to detect when it is changed
let timer_interval = null;
let cache_size = null;

// pause due to compilation errors, require changing inputs
let paused = false;
// pause timer update
let timer_pause = false;
let custom_example = false;

let old_keypress_callback = null;

function share(ev) {
    navigator.clipboard.writeText(window.location.href.split('?')[0] + "?code=" + encodeURIComponent(document.getElementById("textinput").value));
    let html_before = ev.target.innerHTML;
    ev.target.innerHTML = "Copied link to clipboard!"
    ev.target.addEventListener("mouseout", () => {ev.target.innerHTML = html_before})
}

function update_input() {
    update_file("", "input.typ", encoder.encode(JSON.stringify(Object.assign({}, inputs, temp_inputs))))
}

function addKeyToInput(ev, keyboard_metadata, key_update) {
    let focusedNodeName = document.activeElement && document.activeElement.nodeName;
    if(focusedNodeName === 'TEXTAREA' ) {return}
    if ((typeof(keyboard_metadata) == "string" || Array.isArray(keyboard_metadata)) && keyboard_metadata.includes(ev.key)) {
        inputs["input"] += ev.key;
        console.log("Key press:", ev.key)
    } else {
        inputs["pressed_key"] = ev.key;
    }
    if (key_update) {recompile()};
}

/// returns true if action is known
async function processAction(action) {
    console.log(action);
    if (action[0] == "print") { 
        inputs["input"] += action[1] ? action[1] : " ";
    } else if (action[0] == "reset") {
        inputs["input"] = "";
    } else if (action[0] == "update") {
        await recompile();
    } else if (action[0] == "set") {
        inputs[action[1]] = action[2];
    } else if (action[0] == "set-temp") {
        temp_inputs[action[1]] = action[2];
    } else if (action[0] == "toggle_timer") {
        timer_pause = !timer_pause;
    }
     else {
        console.log("Unknown action:", action[0])
    }
}

async function processActions(actionString, args={}) {
    for (const action of actionString.split(";")) {
        await processAction(action.split(" "), args)
    }
}

async function recompile() {
    let err_text = "";
    
    update_needed = true
    if (currently_recompiling) {
        return
    }
    let compile_result;
    let old_buttons;
    let b_values = {};
    let selection;
    let display_element = document.getElementById("display");
    while (update_needed) {
        update_needed = false;
        currently_recompiling = true;
        try {
            old_buttons = document.getElementsByClassName("typst-element");
            for (let old_b of old_buttons) {
                b_values[old_b.id] = old_b.type === "checkbox" ? old_b.checked : old_b.value;
            }
            selection = [document.activeElement.id, document.activeElement.selectionStart, document.activeElement.selectionEnd];
            inputs["input_elements"] = b_values;
            update_input();
            compile_result = await js_recompile();
            display_element.innerHTML = compile_result.html;
        } catch (err) {
            console.log(err);
            err_text = err.map(e => e.message).join("\n ");
        }
    }
    currently_recompiling = false;
    document.getElementById("error").innerHTML = err_text;

    if (err_text == "") {
        paused = false
        let buttons = document.getElementsByClassName("typst-element");

        for (let b_id in b_values) {
            let b = document.getElementById(b_id)
            if (b) {
                if (b.type === "checkbox") {
                    b.checked = b_values[b_id]; 
                } else {
                    b.value = b_values[b_id];
                }
            }
        }

        if (selection && document.getElementById(selection[0])) {
            document.getElementById(selection[0]).setSelectionRange(selection[1],selection[2]);
        }

        for (let b of buttons) {
            let b_actions = b.getAttribute("typst-action");
            b.addEventListener("click", async ev => {
                await processActions(b_actions, {b_values, value: ev.target.value})
                if (document.getElementById(b.id)) {
                    document.getElementById(b.id).focus();
                }
            })

            if (b.classList.contains("typst-update-ontype")) {
                b.addEventListener("input", async ev => {
                    await processActions(b.getAttribute("typst-action"), {b_values, value: ev.target.value})
                    document.getElementById(b.id).focus();
                })
            }
        }
        if (compile_result.metadata) {
            let metadata = JSON.parse(compile_result.metadata)
            if (metadata["keyboard-input"]) {
                document.removeEventListener("keypress", old_keypress_callback);
                metadata["key-update"] = metadata["key-update"] === undefined ? true : metadata["key-update"];
                old_keypress_callback = e => addKeyToInput(e, metadata["keyboard-input"], metadata["key-update"]);
                document.addEventListener("keypress", old_keypress_callback);
            }
            if (metadata["timer"] && (metadata["timer"] != timer_interval || (!timer_id && !timer_pause))) {
                if (timer_id) {
                    clearInterval(timer_id);
                }
                timer_interval = metadata["timer"];
                console.log("set timeout")
                timer_id = setInterval(() => {
                    if (paused) {return}
                    inputs["timer"] += 1;
                    if (metadata["timer-action"]) {
                        processActions(metadata["timer-action"]);
                    } else {
                        recompile();
                    }
                    
                }, timer_interval * 1000)
            }
            if (timer_id && (!metadata["timer"] || timer_pause)) {
                clearInterval(timer_id);
                timer_id = null;
            }
            if (metadata["cache-size"] && metadata["cache-size"] != cache_size) {
                cache_size = metadata["cache-size"]
                set_cache_size(metadata["cache-size"])
            }
            if (metadata["next-input"]) {
                inputs["next-input"] = metadata["next-input"]
            }
            document.getElementById("stop_animate").style.display = metadata["stop-button"] ? "block" : "none";
        }
    } else {
        paused = true
    }
}

async function run() {
    const params = new URLSearchParams(window.location.search);
    let example = params.get("example");
    let input_area = document.getElementById("textinput");
    if (example == null) {
        let code = params.get("code");
        if (code) {
            custom_example = true;
            input_area.value = code;
        } else {
            custom_example = true;
            input_area.value = localStorage.getItem("textinput_data")
        }
    } else {
        let fetch_name = "examples/" + example + ".typ";
        input_area.value = await (await fetch(fetch_name)).text();
    }
    await init();
    document.getElementById("loading").remove();
    
    set_request_f((package_name, file) => {
        console.log("Data request", package_name, file);
        if (package_name != "") {
            let src_package_name = package_name;
            if (!package_name.slice(0, "@preview/".length) == "@preview/") {
                console.error("Package doesn't start with preview, but is", package_name)
            }
            package_name = package_name.slice("@preview/".length).replace(":", "-")
            fetch('packages/' + package_name + "/" + file)
                .then((response) => {
                    response.bytes().then(bytes => {
                        update_file(src_package_name, file, bytes)
                        console.log("Recompiled")
                        recompile();
                    });
                })
            return null;
        }
        if (file == "main.typ") {
            return encoder.encode(input_area.value)
        } else if (file == "input.typ") {
            return encoder.encode(JSON.stringify(inputs))
        }
        else {
            document.getElementById("error").innerHTML = "No such file available: " + package_name + "/"+ file + " "
        }
    })
    recompile()

    input_area.addEventListener("input", e => {
        update_file("", "main.typ", encoder.encode(e.target.value));
        
        recompile();
        if (custom_example) {
            localStorage.setItem("textinput_data", e.target.value);
        }
    });

    document.getElementById("share_button").addEventListener("click", share);
    document.getElementById("stop_animate").addEventListener("click", () => {timer_pause = !timer_pause; if (!timer_pause) {recompile()}})

}

run();