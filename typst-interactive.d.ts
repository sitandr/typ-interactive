/* tslint:disable */
/* eslint-disable */

export class CompileResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  html: string;
  get metadata(): string | undefined;
  set metadata(value: string | null | undefined);
}

export class ErrorSpan {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  severity: boolean;
  /**
   * The span of the relevant node in the source code.
   * pub span: (FileId: (package + path), range),
   * A diagnostic message describing the problem.
   */
  message: string;
  /**
   * The trace of function calls leading to the problem.
   * Additional hints to the user, indicating how this problem could be avoided
   * or worked around.
   */
  hints: string[];
}

export function js_recompile(): Promise<CompileResult>;

export function set_cache_size(cache_size: number): void;

export function set_request_f(f: Function): void;

export function update_file(package_name: string, file_name: string, data: Uint8Array): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_compileresult_free: (a: number, b: number) => void;
  readonly __wbg_errorspan_free: (a: number, b: number) => void;
  readonly __wbg_get_compileresult_html: (a: number, b: number) => void;
  readonly __wbg_get_compileresult_metadata: (a: number, b: number) => void;
  readonly __wbg_get_errorspan_hints: (a: number, b: number) => void;
  readonly __wbg_get_errorspan_severity: (a: number) => number;
  readonly __wbg_set_compileresult_html: (a: number, b: number, c: number) => void;
  readonly __wbg_set_compileresult_metadata: (a: number, b: number, c: number) => void;
  readonly __wbg_set_errorspan_hints: (a: number, b: number, c: number) => void;
  readonly __wbg_set_errorspan_severity: (a: number, b: number) => void;
  readonly js_recompile: () => number;
  readonly set_cache_size: (a: number) => void;
  readonly set_request_f: (a: number) => void;
  readonly update_file: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly main: (a: number, b: number) => number;
  readonly qcms_profile_precache_output_transform: (a: number) => void;
  readonly lut_inverse_interp16: (a: number, b: number, c: number) => number;
  readonly lut_interp_linear16: (a: number, b: number, c: number) => number;
  readonly qcms_white_point_sRGB: (a: number) => void;
  readonly qcms_transform_data_rgb_out_lut: (a: number, b: number, c: number, d: number) => void;
  readonly qcms_transform_data_rgba_out_lut: (a: number, b: number, c: number, d: number) => void;
  readonly qcms_transform_data_bgra_out_lut: (a: number, b: number, c: number, d: number) => void;
  readonly qcms_transform_data_rgb_out_lut_precache: (a: number, b: number, c: number, d: number) => void;
  readonly qcms_transform_data_rgba_out_lut_precache: (a: number, b: number, c: number, d: number) => void;
  readonly qcms_transform_data_bgra_out_lut_precache: (a: number, b: number, c: number, d: number) => void;
  readonly qcms_profile_is_bogus: (a: number) => number;
  readonly qcms_transform_release: (a: number) => void;
  readonly __wbg_set_errorspan_message: (a: number, b: number, c: number) => void;
  readonly __wbg_get_errorspan_message: (a: number, b: number) => void;
  readonly qcms_enable_iccv4: () => void;
  readonly __wasm_bindgen_func_elem_26222: (a: number, b: number, c: number) => void;
  readonly __wasm_bindgen_func_elem_26221: (a: number, b: number) => void;
  readonly __wasm_bindgen_func_elem_6261: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_export: (a: number, b: number) => number;
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export3: (a: number) => void;
  readonly __wbindgen_export4: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
