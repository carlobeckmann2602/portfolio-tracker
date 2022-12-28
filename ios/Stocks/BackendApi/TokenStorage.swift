//
//  TokenStorage.swift
//  Stocks
//
//  Created by Jan Honsbrok on 28.12.22.
//

import Foundation
import JWTDecode
import KeychainAccess

class TokenStorage {

  let keychain = Keychain(service: "de.mobsys.gofundyourself")

  init() {}

  func loadToken() -> JwtToken? {
    let tokenString = keychain["token"]

    if tokenString == nil {
      return nil
    }

    do {
      let jwt = try decode(jwt: tokenString!)
      if jwt.expired {
        return nil
      }
      return JwtToken(decodedToken: jwt)
    } catch {
      return nil
    }

  }

  func saveToken(token: JwtToken) {
    keychain["token"] = token.decodedToken.string
    print("saved token")
  }
    
  func deleteToken() {
    do {
      try keychain.remove("token")
    } catch let error {
      print("error: \(error)")
    }
  }
}
