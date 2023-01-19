//
//  JustHttp+Extensions.swift
//  Stocks
//
//  Created by Jan Honsbrok on 28.12.22.
//

import Foundation
import Just

extension HTTPResult {
  func getEntity<T>(
    _ type: T.Type,
    keyDecodingStrategy: JSONDecoder.KeyDecodingStrategy = .useDefaultKeys,
    expectedStatusCode: Int = 200
  ) throws -> T where T: Decodable {
    if self.statusCode != expectedStatusCode {
      if self.error != nil {
        throw self.error!
      } else {
        throw NSError(
          domain:
            "HTTP response has not expected status code, expected \(expectedStatusCode), was \(self.statusCode)",
          code: self.statusCode!)
      }
    }
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = keyDecodingStrategy
    return try decoder.decode(T.self, from: self.text!.data(using: .utf8)!)
  }
}
