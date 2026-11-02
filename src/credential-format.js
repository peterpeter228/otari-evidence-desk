// Format gate only, not authentication or proof the key is active/scoped.
export function isDedicatedOtariKey(value){return typeof value==='string'&&value.length<=256&&/^otk_v1_[A-Za-z0-9._~+/-]{16,248}=*$/.test(value);}
