import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import AccessTokenEntity from "../../../../domain/auth/AccessTokenEntity";
import {ClientApi} from "../../../lib/ClientApi";

/**
 * 認可のテスト
 *
 * このテストを成功させるには事前にAuthleteにクライアントIDの登録が必要です。
 */
describe("Authorization", () => {

  /**
   * 正常系のテストケース
   * クライアントクレデンシャルで発行したアクセストークンでAPIを呼び出せる事
   */
  it("testSuccessClientCredentials", () => {
    const tokenRequest: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_clients"]
    };

    return AuthApi.ApiClient.issueAccessTokenInCheatApi(tokenRequest).then((response) => {
      const accessTokenRepository = new AccessTokenRepository();
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity) => {
      return ClientApi.ApiClient.find(tokenRequest.clientId, accessTokenEntity.token);
    }).then((response) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.client_id, tokenRequest.clientId);
    });
  });

  /**
   * 正常系のテストケース
   * 認可コードで発行したアクセストークンでAPIを呼び出せる事
   */
  it("testSuccessAuthorizationCode", () => {
    const tokenRequest: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.AUTHORIZATION_CODE,
      clientId: 1957483863470,
      subject: "796c6536-5e55-4da6-adf1-9a6badfb2e3c",
      scopes: ["prototype_clients"]
    };

    return AuthApi.ApiClient.issueAccessTokenInCheatApi(tokenRequest).then((response) => {
      const accessTokenRepository = new AccessTokenRepository();
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity) => {
      return ClientApi.ApiClient.find(tokenRequest.clientId, accessTokenEntity.token);
    }).then((response) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.client_id, tokenRequest.clientId);
    });
  });
});
