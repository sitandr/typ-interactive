#import "@preview/conchord:0.4.0": red-missing-fifth, n-best, get-chords,


#let inp_field(id, value, width: "auto", type: "text") = html.elem("input", attrs: (style: "width:" + width +"; height: 10pt", type: type, class: "typst-element typst-update-ontype", typst-action: "update", id: id, ..if (type == "checkbox") {(checked: if value {"true"} else {"false"})} else {(value: str(value))}))

#let inputs = json(read("input.typ", encoding: none))
#let inputer(id, default, width: "auto", type: "text") = {
  (
    html.span(html.frame(id + [:] + h(0.3em))) + html.span(inp_field(id, default, width: width, type: type)),
    inputs.input_elements.at(id, default: default)
  )
}

#let (d, chordname) = inputer("Chord", "Am", width: "60pt")
#d

#let (d, tuning) = inputer("Tuning", "E1 A1 D2 G2 B2 E3")
#d

#let (d, true-bass) = inputer("Enable true-bass", true, type: "checkbox")
#d

#let (d, omit-fifth) = inputer("Allow omitting perfect fifth", true, type: "checkbox")
#d

#let (d, best-n) = inputer("Number to show", "20")
#d


#for c in n-best(get-chords(chordname, true-bass: true-bass, omit-fifth: omit-fifth, tuning: tuning), n: int(best-n)) {
  box(html.frame(red-missing-fifth(c)))
}
