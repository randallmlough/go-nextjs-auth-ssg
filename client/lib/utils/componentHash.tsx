import React from "react";

export interface ComponentMap {
  delete(key: any): boolean;
  get(key: any): React.Component | undefined;
  has(key: any): boolean;
  set(key: any, value: React.Component): this;
  map(callbackfn: (value: React.Component) => void, thisArg?: any): void;
}

export class ComponentHash implements ComponentMap {
  components: Map<string, React.Component>;
  constructor(components) {
    const hash = new Map();
    React.Children.forEach(components, (child) => {
      const name = child?.type?.displayName || child?.type?.name;
      if (name) hash.set(child.type.displayName || child.type.name, child);
    });
    this.components = hash;
  }

  delete(key: any): boolean {
    return false;
  }

  get(key: any): React.Component | undefined {
    return this.components.get(key.displayName) || undefined;
  }

  has(key: any): boolean {
    return false;
  }

  set(key: any, value: React.Component): this {
    return undefined;
  }

  map(fn: (value: React.Component) => void, thisArg?: any): any {
    debugger;
    const comps = [];
    this.components.forEach((comp) => comps.push(comp));
    return comps;
  }
}
