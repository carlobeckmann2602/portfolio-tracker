//
//  PortfolioHandler.swift
//  Stocks
//
//  Created by Jan Honsbrok on 09.12.22.
//

import Foundation
import JWTDecode
import Just

struct AddToPortfolioDto: Encodable {
  var amount: Int
  var pricePerUnit: Float
  var date: Date
}

struct PortfolioOnUserDto: Decodable {
  var id: Int
  var symbol: String
  var name: String
  var description: String
  var amountAfterSplit: Int
  var price: Float
  var trend: Float
  var moneyInvestedInStock: Float
  var gainAbsolute: Float
  var gainPercentage: Float
  var histories: [StockHistory]
}

struct PortfolioDto: Decodable {
  var currentPortfolioValue: Float
  var gainAbsolute: Float
  var gainPercentage: Float?
  var stocks: [PortfolioOnUserDto]
}

class PortfolioHandler {

  private let authenticationHandler: AuthenticationHandler

  init(authenticationHandler: AuthenticationHandler) {
    self.authenticationHandler = authenticationHandler
  }

  func loadUserPortfolio(onComplete: @escaping (Portfolio) -> Void) {
    JustOf<HTTP>().get(
      "\(ApiUtils.BASE_URL)/users/me/stocks",
      headers: authenticationHandler.getHeaders(),
      asyncCompletionHandler: { r in
        if !r.ok {
          return
        }
        do {
          let portfolioDto = try r.getEntity(PortfolioDto.self)

          let portfolioStocks = self.mapToPortfolioEntries(portfolioDto)

          let portfolio = Portfolio(
            stocks: portfolioStocks, currentPortfolioValue: portfolioDto.currentPortfolioValue,
            gainAbsolute: portfolioDto.gainAbsolute,
            gainPercentage: portfolioDto.gainPercentage ?? 0)

          onComplete(portfolio)
        } catch {
          print("Failed load portfolio: \(error)")
        }
      }
    )
  }

  func addToPortfolio(
    stockId: Int, amount: Int, pricePerUnit: Float, date: Date,
    onComplete: @escaping (PortfolioEntry) -> Void
  ) throws {
    let dto = AddToPortfolioDto(amount: amount, pricePerUnit: pricePerUnit, date: date)
    let jsonEncoder = JSONEncoder()
    jsonEncoder.dateEncodingStrategy = .iso8601
    let jsonData = try jsonEncoder.encode(dto)

    JustOf<HTTP>().post(
      "\(ApiUtils.BASE_URL)/users/me/stocks/\(stockId)",
      headers: authenticationHandler.getHeaders(),
      requestBody: jsonData,
      asyncCompletionHandler: { r in
        if !r.ok {
          return
        }
        do {
          let portfolioOnUserDto = try r.getEntity(PortfolioOnUserDto.self)
          onComplete(self.mapToPortfolioEntry(portfolioOnUserDto))
        } catch {
          print("Failed to add stock to portfolio: \(error)")
        }
      }
    )
  }

  func removeFromPortfolio(
    stockId: Int, amount: Int,
    onComplete: @escaping () -> Void
  ) throws {
    let dto = AddToPortfolioDto(amount: amount, pricePerUnit: 50, date: Date())
    let jsonEncoder = JSONEncoder()
    jsonEncoder.dateEncodingStrategy = .iso8601
    let jsonData = try jsonEncoder.encode(dto)

    JustOf<HTTP>().delete(
      "\(ApiUtils.BASE_URL)/users/me/stocks/\(stockId)",
      headers: authenticationHandler.getHeaders(),
      requestBody: jsonData,
      asyncCompletionHandler: { r in
        if !r.ok {
          return
        }
        onComplete()
      }
    )
  }

  private func mapToPortfolioEntries(_ portfolioDto: PortfolioDto) -> [PortfolioEntry] {
    return portfolioDto.stocks.map { stockOnUserDto in
      return mapToPortfolioEntry(stockOnUserDto)
    }
  }

  private func mapToPortfolioEntry(_ stockOnUserDto: PortfolioOnUserDto) -> PortfolioEntry {
    let stock = Stock(
      id: stockOnUserDto.id, name: stockOnUserDto.name, symbol: stockOnUserDto.symbol,
      description: stockOnUserDto.description, histories: stockOnUserDto.histories)
    return PortfolioEntry(
      stock: stock,
      amountAfterSplit: stockOnUserDto.amountAfterSplit,
      price: stockOnUserDto.price,
      trend: stockOnUserDto.trend,
      moneyInvestedInStock: stockOnUserDto.moneyInvestedInStock,
      gainAbsolute: stockOnUserDto.gainAbsolute,
      gainPercentage: stockOnUserDto.gainPercentage
    )
  }
}
