//
//  NetworkAdapter.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import JWTDecode
import Just

class NetworkAdapter {

  private let authenticationHandler: AuthenticationHandler

  init(authenticationHandler: AuthenticationHandler) {
    self.authenticationHandler = authenticationHandler
  }

  func loadUserPortfolio() {
    Just.get(
      "https://api.mobilesys.de/users/\(self.authenticationHandler.getToken().userId())/stocks",
      headers: [
        "Authorization": "Bearer \(self.authenticationHandler.getToken().decodedToken.string)"
      ],
      asyncCompletionHandler: { r in
        print(r)
        if r.ok {
          print(r.text)
        }
      })
  }

}
