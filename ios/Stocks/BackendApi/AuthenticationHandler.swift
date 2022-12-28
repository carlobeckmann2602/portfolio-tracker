//
//  AuthenticationHandler.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import JWTDecode
import Just

struct AuthResponse: Decodable {
  let accessToken: String
}

struct ReponseError: Decodable {
  let statusCode: Int
  let message: String
  let error: String
}

struct JwtToken {
  let decodedToken: JWT
  init(decodedToken: JWT) {
    self.decodedToken = decodedToken
  }
  func userId() -> Int {
    return decodedToken["sub"].integer!
  }
  func isExpired() -> Bool {
    return decodedToken.expired
  }
}

class AuthenticationHandler: ObservableObject {

  @Published var isLoggedIn: Bool = false

  private var jwtToken: JwtToken? = nil
  private var tokenStorage = TokenStorage()

  init() {
    let loadedToken = self.tokenStorage.loadToken()
    self.isLoggedIn = loadedToken != nil
    if self.isLoggedIn {
      jwtToken = loadedToken
    }
  }

  func register(email: String, password: String, password2: String) {
    Just.post(
      "\(ApiUtils.BASE_URL)/users",
      data: [
        "email": email, "password": password,
        "password2": password2,
      ],
      asyncCompletionHandler: { r in
        if r.error != nil {
          print("Error: " + r.reason)
          return
        }
        if r.statusCode == 403 {
          let reponseError = self.readErrorFromReponse(reponse: r)
          print("Error: \(reponseError!.message)")
          return
        }
        if r.statusCode == 201 {
          do {
            try self.getJwtTokenFromResponse(text: r.text!)
          } catch {
            print("Failed to decode JWT: \(error)")
            return
          }
        }
        print("Unexpected reponse: \(r.statusCode) \(r.content)")
      })
  }

  func login(email: String, password: String) {
    Just.post(
      "\(ApiUtils.BASE_URL)/auth/login",
      data: [
        "email": email, "password": password,
      ],
      asyncCompletionHandler: { r in
        if r.error != nil {
          print("Error: " + r.reason)
          return
        }
        if r.statusCode == 403 {
          let reponseError = self.readErrorFromReponse(reponse: r)
          print("Error: \(reponseError!.message)")
          return
        }
        if r.statusCode == 201 {
          do {
            try self.getJwtTokenFromResponse(text: r.text!)
          } catch {
            print("Failed to decode JWT: \(error)")
            return
          }
        }
        print("Unexpected reponse: \(r.statusCode) \(r.content)")
      })
  }

  func getToken() -> JwtToken {
    return jwtToken!
  }
  func getHeaders() -> [String: String] {
    return [
      "Authorization": "Bearer \(getToken().decodedToken.string)"
    ]
  }

  private func readErrorFromReponse(reponse: HTTPResult) -> ReponseError? {
    let decoder = JSONDecoder()
    do {
      return try decoder.decode(ReponseError.self, from: reponse.text!.data(using: .utf8)!)
    } catch {
      print("Failed load error message: \(error)")
      return nil
    }
  }

  private func getJwtTokenFromResponse(text: String) throws {
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    let authReponse = try decoder.decode(AuthResponse.self, from: text.data(using: .utf8)!)
    let jwt = try decode(jwt: authReponse.accessToken)
    print("Loaded JWT: ", jwt)
    self.jwtToken = JwtToken(decodedToken: jwt)
    self.isLoggedIn = true
    self.tokenStorage.saveToken(token: self.jwtToken!)
  }
}
