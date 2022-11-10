//
//  Stock.swift
//  Stocks
//
//  Created by Jan Honsbrok on 03.11.22.
//

import Foundation

struct Stock: Hashable, Codable, Identifiable {
  var id: Int  //UUID()
  var name: String
  var value: Float
}
