/**
 * Generate a mock fetch for use with the service container
 * @param  result return result from the mocked fetch
 * @return        constructed fetch mock
 */
export const fetchMock = function (
  result = {}, // eslint-disable-line @typescript-eslint/no-explicit-any
  status = 200
) {
  const fetch = this.sinon.stub().returns({
    ok: status < 300 && status > 199,
    status,
    json: this.sinon.stub().returns(result),
    text: this.sinon.stub().returns(JSON.stringify(result)),
  });
  return fetch;
};
