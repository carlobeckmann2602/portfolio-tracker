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
  let access_token: String
}

class AuthenticationHandler: ObservableObject {

  @Published var isLoggedIn: Bool = false

  private var jwtToken: JwtToken? = nil

  func register(email: String, password: String, password2: String) {
    Just.post(
      "https://api.mobilesys.de/users",
      data: [
        "email": email, "password": password,
        "password2": password2,
      ],
      asyncCompletionHandler: { r in
        print(r)
        if r.ok {  // TODO check for 201
          print(r.text)
          do {
            try self.getJwtTokenFromResponse(text: r.text!)
          } catch {
            print("Failed to decode JWT: \(error)")
          }
          NetworkAdapter(authenticationHandler: self).loadUserPortfolio()
        }
      })
  }

  func login(email: String, password: String) {
    Just.post(
      "https://api.mobilesys.de/auth/login",
      data: [
        "email": email, "password": password,
      ],
      asyncCompletionHandler: { r in
        print(r)
        if r.ok {  // TODO check for correct response status
          print(r.text)
          do {
            try self.getJwtTokenFromResponse(text: r.text!)
          } catch {
            print("Failed to decode JWT: \(error)")
          }
          NetworkAdapter(authenticationHandler: self).loadUserPortfolio()
        }
      })
  }

  func wasLoggedInBefore() -> Bool {
    return false
  }

  func getToken() -> JwtToken {
    return jwtToken!
  }

  private func writeWasLoggedInBefore() {

  }

  private func getJwtTokenFromResponse(text: String) throws {
    let decoder = JSONDecoder()
    let authReponse = try decoder.decode(AuthResponse.self, from: text.data(using: .utf8)!)
    let jwt = try decode(jwt: authReponse.access_token)
    print("Loaded JWT: ", jwt)
    self.jwtToken = JwtToken(decodedToken: jwt)
    self.isLoggedIn = true
  }
}
