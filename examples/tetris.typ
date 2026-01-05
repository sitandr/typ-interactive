#import "@preview/soviet-matrix:0.2.1": game

#let inputs = json(read("input.typ", encoding: none))
#let input = inputs.input

#show v: it => html.div(style: "height: " + str(it.amount.to-absolute() / 1pt) + "pt")

#let rules = [_Keyboard input:_

- `a`: move left
- `d`: move right
- `q`: rotate left
- `e`: rotate right
- `f`: drop down
- `w`: flip
- `c`: hold / get from holded

Powered by powerful soviet-matrix package.
]

#let game_block = html.frame(scale(200%, block(game([#input]), inset: (top: 0in - 30pt, bottom: 0.5in + 40pt, rest: 0.5in)), reflow: true))

#show grid: it => context {
  if target() == "html" {
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
  } else {it}
}

#show table: it => context {if target() == "html" {html.div(it, class: "table-wrap")} else {it}}

#let button(action, body, width: "30pt") = html.elem("button", attrs: (style: "width:" + width +"; height: 30pt", class: "typst-element", typst-action: action + ";update"), body)

#v(20pt)


#grid(columns: 2, rules + v(1em) + grid(columns: 3)[#button("print q", sym.arrow.ccw)][#button("print w", "↑")][#button("print e", sym.arrow.cw)][#button("print a", "←")][#button("print f", "↓")][#button("print d", "→")][#grid.cell(colspan: 3)[#button("print w", "flip", width: "100pt")]][#grid.cell(colspan: 3)[#button("print c", "store", width: "100pt")]][#grid.cell(colspan: 3)[#button("reset", "Reset", width: "100pt")]], [#game_block])

#metadata(json.encode((timer: 2, timer-action: "print .;update", keyboard-input: "wasdfqwec")))<interact-var>
