#import "@preview/lilaq:0.5.0" as lq

*Wait till it makes a full cycles, it will speed up due to memoization!*

#let inp_field(id, width: "60pt", value) = html.elem("input", attrs: (style: "width:" + width +"; height: 10pt", class: "typst-element typst-update-ontype", typst-action: "update", id: id, value: str(value)))

#let inputs = json(read("input.typ", encoding: none))
#let inputer(id, default, width: "60pt") = {
  (
    html.span(html.frame(eval(id, mode: "math") + $=$ + h(0.3em))) + html.span(inp_field(id, default, width: width)) + [°],
    float(inputs.input_elements.at(id, default: default))
  )
}

#let (d, dphi) = inputer("Delta phi", 60., width: "60pt")
#d

#let t = calc.rem(inputs.timer, 90) * 4deg/1rad
#let xs = lq.linspace(-1, 2)
#html.frame(lq.diagram(
  ylim: (-1.5, 1.5),
  lq.fill-between(
    xs,
    xs.map(x => calc.sin(x + t)),
    y2: xs.map(y => calc.sin(y + t + dphi * 1deg/1rad)),
  )
))

#metadata(json.encode((timer: 0.01, cache-size: 90, stop-button: true)))<interact-var>