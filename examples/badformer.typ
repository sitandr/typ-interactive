#import "@preview/badformer:0.1.0": game
#let inputs = json(read("input.typ", encoding: none))
#let input = inputs.input

*Behold: the permadeath interactive version of laurmaedje's 3D #emph[bad]former*

#html.frame(scale(60%, block(width: 1000pt, height: 700pt, game(input), fill: black), reflow: true))

#metadata(json.encode((keyboard-input: "wasde "))) <interact-var>

#let button(action, body, width: "30pt") = html.elem("button", attrs: (style: "width:" + width +"; height: 30pt", class: "typst-element", typst-action: action + ";update"), body)

#block(button("reset", "Reset", width: "100pt"))
// type: "text/css"
#html.style(media:"screen")[svg {overflow: clip !important}]


Navigation: WASD for moving and rotating, SPACE to jump, E to see the map 

Reach the goal, try using as low moves as possible


#show grid: it => context {
  let args = it.fields()
  show grid.cell: it => {
        let fields = it.fields()
        let _ = fields.remove("body")
        table.cell(..fields, it.body)}
      let children = args.remove("children").map(cell => {
      if cell.func() == grid.cell {
        let args = cell.fields()
        let body = args.remove("body")
        return table.cell(..args, body)
      }
      cell.body
  })
  html.div(table(..args, ..children), class: "grid-wrap")
}


#grid(columns: 3)[][#button("print w", "↑")][#button("print e", html.div(emoji.map, style: "font-size: 1.5em"))][#button("print a", "←")][#button("print f", "↓")][#button("print d", "→")][#grid.cell(colspan: 3)[#button("print ", "jump", width: "100pt")]]
