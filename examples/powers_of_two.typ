#let inputs = json(read("input.typ", encoding: none))

*Behold: the power calculation without any loops, recursion or `calc` *

Typst receives these inputs: #inputs

#let (a, n) = inputs.at("next-input", default: (1, 0))
#if n > 60 {
  a = 1
  n = 1
}
#(a = a * 2)
#(n = n + 1)


#html.frame($2^#n = #a$)

// set timer for one second + set input to next recompilations
#metadata(json.encode((timer: 1, next-input: (a: a, n: n))))<interact-var>
