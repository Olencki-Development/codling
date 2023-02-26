export class JSONDataCoder {
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }
  encode(data) {
    return JSON.stringify(data);
  }
  async decode(data) {
    const strData = await data.text();
    return JSON.parse(strData);
  }
}
