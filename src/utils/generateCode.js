function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
}

export function secureCodeGenerator() {
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += between(0, 9);
    }
    return code;
}