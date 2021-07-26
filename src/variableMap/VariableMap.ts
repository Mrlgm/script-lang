export default class VariableMap {
  private variableMap = {};

  put(varName: string, varValue: string | number) {
    this.variableMap[varName] = varValue;
  }

  get(varName: string) {
    return this.variableMap[varName];
  }

  containsKey(varName: string) {
    return this.variableMap.hasOwnProperty(varName);
  }
}
