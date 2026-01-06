#title[Trying out Typst for interactive pages]

= Possibilities

I've noticed many Typst projects could really benefit from an _interactive_ web-based environment, so I've put a little of my time to build this thing.

With it, it is possible to build:

- Simple interactive games (where there are no tight requirements for animations or real-time updates)
- Interactive graphing tools
- Slow lagging animations
- State machines

Experiment as much as you want, change the code with immediate change, or write it from scratch on "Custom" ("custom" stores code between reloads).

Code can be shared with "Share" button (beware: all code is embed without any deflation into URL, so URL will be very long and very big code may be truncated).

= Issues

The main current issue is that when Typst updates HTML, simply replacing that HTML also rewrites input elements, interfering with user inputs.

I see the following ways out:

- The easiest: fix inputs from outside, not doing them from Typst, or from other version of Typst script. Limits flexibility greatly.
- The probably best, if can be properly implemented: convert Typst's html to `virtual-dom`, and then use common js tools to diff the Typst changes. It could also improve the speed.
- The hackest: restore parameters of all common inputs between compilations 

*Another warning: currently frame compilation doesn't support any fonts other than standard*

#line(length: 100%)

= Contributions

Any contributions and issues are welcome, you can either submit an interactive document (e.g., via "share" link), 
request additional features or adding your favorite package to the site,
or you can even make changes to the very hastily and roughly written site code, everyone is welcome.

I'm not promising I would be always fast to answer, but eventually I will. Feel free to tag me if I haven't answered.

Github source: https://github.com/sitandr/typ-interactive/

Based on my version of Typst compiler for web: https://github.com/sitandr/tylighter

