//
//  NetworkAdapter.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import JWTDecode
import Just

struct RegisterResponse: Decodable {
  let access_token: String
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

class NetworkAdapter {

  private var jwtToken: JwtToken?=nil

  func register(email: String, password: String, password2: String) {
    Just.post(
      "https://api.mobilesys.de/users",
      data: [
        "email": email, "password": password,
        "password2": password2,
      ],
      asyncCompletionHandler: { r in
        print(r)
        if r.ok {
          print(r.text)
          do {
            let decoder = JSONDecoder()
            let registerResponse = try decoder.decode(
              RegisterResponse.self, from: r.text!.data(using: .utf8)!)
            let jwt = try decode(jwt: registerResponse.access_token)
            print(jwt)
            self.jwtToken = JwtToken(decodedToken: jwt)
            self.loadUserPortfolio()
          } catch {
            print("Failed to decode JWT: \(error)")
          }
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
        if r.ok {
          print(r.text)
          do {
            let decoder = JSONDecoder()
            let registerResponse = try decoder.decode(
              RegisterResponse.self, from: r.text!.data(using: .utf8)!)
            let jwt = try decode(jwt: registerResponse.access_token)
            print(jwt)
            let jwtToken = JwtToken(decodedToken: jwt)
            self.loadUserPortfolio()
          } catch {
            print("Failed to decode JWT: \(error)")
          }
        }
      })
  }

  func loadUserPortfolio() {
    Just.get(
      "https://api.mobilesys.de/users/\(self.jwtToken.userId())/stocks",
      headers: ["Authorization": "Bearer \(self.jwtToken.decodedToken.string)"],
      asyncCompletionHandler: { r in
        print(r)
        if r.ok {
          print(r.text)
        }
      })
  }

}
