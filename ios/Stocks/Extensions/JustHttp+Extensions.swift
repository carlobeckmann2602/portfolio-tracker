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
    keyDecodingStrategy: JSONDecoder.KeyDecodingStrategy = .useDefaultKeys
  ) throws -> T where T: Decodable {
    if !self.ok {
      throw self.error!
    }
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = keyDecodingStrategy
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    return try decoder.decode(T.self, from: self.text!.data(using: .utf8)!)
  }
}
