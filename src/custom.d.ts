// src/custom.d.ts

// Declaration for PNG files
declare module '*.png' {
  const value: string;
  export default value;
}

declare module 'figma:*' {
  const value: string;
  export default value;
}

// Optional: Add for other common image types
declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}