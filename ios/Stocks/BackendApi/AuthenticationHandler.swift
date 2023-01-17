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

struct ReponseError403: Decodable {
  let statusCode: Int
  let message: String
  let error: String
}

struct ReponseError400: Decodable {
  let statusCode: Int
  let message: [String]
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

  @Published var isLoggedIn: Bool = false {
    didSet {
      if isLoggedIn {
        print("Logged in with JWT: \(jwtToken!.decodedToken.string)")
      }
    }
  }

  private var jwtToken: JwtToken? = nil
  private var tokenStorage = TokenStorage()

  init() {
    let loadedToken = self.tokenStorage.loadToken()
    let isLoggedIn = loadedToken != nil
    if isLoggedIn {
      jwtToken = loadedToken
    }
    self.isLoggedIn = isLoggedIn

  }

  func register(
    email: String, password: String, password2: String, onError: @escaping (String) -> Void
  ) {
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
        switch r.statusCode {
        case 403:
          let reponseError = self.readErrorFromReponse403(response: r)
          print("Error: \(reponseError!.message)")
          onError(reponseError!.message)
          return
        case 201:
          do {
            try self.getJwtTokenFromResponse(r)
            return
          } catch {
            print("Failed to decode JWT: \(error)")
            return
          }
        case 400:
          let reponseError = self.readErrorFromReponse400(response: r)
          print("Error: \(reponseError!.message.joined(separator: "\n"))")
          onError(reponseError!.message.joined(separator: "\n"))
          return
        default:
          print("Unexpected reponse: \(r.statusCode) \(r.content)")
        }
      })
  }

  func login(email: String, password: String, onError: @escaping (String) -> Void) {
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
        switch r.statusCode {
        case 403:
          let reponseError = self.readErrorFromReponse403(response: r)
          print("Error: \(reponseError!.message)")
          onError(reponseError!.message)
          return
        case 201:
          do {
            try self.getJwtTokenFromResponse(r)
            return
          } catch {
            print("Failed to decode JWT: \(error)")
            return
          }
        case 400:
          let reponseError = self.readErrorFromReponse400(response: r)
          print("Error: \(reponseError!.message.joined(separator: "\n"))")
          onError(reponseError!.message.joined(separator: "\n"))
          return
        default:
          print("Unexpected reponse: \(r.statusCode) \(r.content)")
        }
      })
  }

  func logout() {
    tokenStorage.deleteToken()
    isLoggedIn = false
  }

  func getToken() -> JwtToken {
    return jwtToken!
  }
  func getHeaders() -> [String: String] {
    return [
      "Authorization": "Bearer \(getToken().decodedToken.string)",
      "Content-Type": "application/json",
    ]
  }

  private func readErrorFromReponse403(response: HTTPResult) -> ReponseError403? {
    do {
      return try response.getEntity(ReponseError403.self, expectedStatusCode: 403)
    } catch {
      print("Failed load error message: \(error)")
      return nil
    }
  }

  private func readErrorFromReponse400(response: HTTPResult) -> ReponseError400? {
    do {
      return try response.getEntity(ReponseError400.self, expectedStatusCode: 400)
    } catch {
      print("Failed load error message: \(error)")
      return nil
    }
  }

  private func getJwtTokenFromResponse(_ r: HTTPResult) throws {
    let authReponse = try r.getEntity(
      AuthResponse.self, keyDecodingStrategy: .convertFromSnakeCase, expectedStatusCode: 201)
    let jwt = try decode(jwt: authReponse.accessToken)
    print("Loaded JWT: ", jwt)
    self.jwtToken = JwtToken(decodedToken: jwt)
    self.isLoggedIn = true
    self.tokenStorage.saveToken(token: self.jwtToken!)
  }
}
