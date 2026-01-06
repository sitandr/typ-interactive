#import "@preview/lilaq:0.5.0" as lq
#let inp_field(id, width: "60pt", value) = html.elem("input", attrs: (style: "width:" + width +"; height: 10pt", class: "typst-element typst-update-ontype", typst-action: "update", id: id, value: str(value)))

_Of course, that is very far from the most impressive thing it could do with power of lilaq, I just couln't make up my mind between these two examples._

#let inputs = json(read("input.typ", encoding: none))
#let inputer(id, default, width: "60pt", end: none) = {
  (
    html.span(html.frame(eval(id, mode: "math") + $=$ + h(0.3em))) + html.span(inp_field(id, default, width: width)) + end,
    float(inputs.input_elements.at(id, default: default))
  )
}

#let (d, o1) = inputer("omega_1", 10., width: "60pt", end: [°])
#d

#let (d, o2) = inputer("omega_2", 11, width: "60pt", end: [°])
#d

#let (d, a1) = inputer("A_1", 1.0, width: "60pt")
#d

#let (d, a2) = inputer("A_2", 1.01, width: "60pt")
#d

#let t = inputs.timer * 4deg/1rad
#let xs = lq.linspace(-1 + t, 2 + t, num: 100)
#html.frame(lq.diagram(
  ylim: (-(a1 + a2), (a1 + a2)),
  lq.plot(
    xs,
    mark: none,
    xs.map(x => a1 * calc.sin(x * o1) + a2 * calc.sin(x * o2)),
  )
))

#metadata(json.encode((timer: 0.01, cache-size: 1, stop-button: true)))<interact-var>