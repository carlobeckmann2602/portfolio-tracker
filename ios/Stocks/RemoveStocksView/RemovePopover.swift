//
//  RemovePopover.swift
//  Stocks
//
//  Created by Carlo Beckmann on 12.01.23.
//

import SwiftUI

struct RemovePopover: View {
  var stockName: String
  var portfolioEntry: PortfolioEntry
  var portfolio: Portfolio
  var portfolioHandler: PortfolioHandler

  @Binding var showingPopover: Bool

  var body: some View {
    ZStack {
      AppColors.LIGHT_PURPLE
        .opacity(0.8)
        .ignoresSafeArea()
      VStack(alignment: .leading) {
        Spacer()
        HStack {
          Spacer()
          Button {
            showingPopover = false
          } label: {
            Image(systemName: "xmark.circle")
              .foregroundColor(AppColors.PRIMARY)
              .font(.system(size: 50))
          }
        }
        Text("Remove All")
          .robotoSerif(size: 45, weight: .bold)
          .padding(.top, 20)
        Text("Would you like to remove all stocks of \(stockName) from your portfolio?")
          .roboto(size: 20, weight: .regular)
          .cornerRadius(10)
          .padding(.top, 10)
        HStack {
          Button {
            showingPopover = false
          } label: {
            Text("Back")
              .roboto(size: 20, weight: .bold)
              .padding()
              .background(AppColors.PURPLE.cornerRadius(10).frame(width: 120))
              .frame(width: 120)
          }
          Spacer()
          Button {
            do {
              try portfolioHandler.removeFromPortfolio(
                stockId: portfolioEntry.stock.id, amount: portfolioEntry.amountAfterSplit,
                onComplete: {
                  portfolio.removeAllStockFromPortfolio(portfolioEntry: portfolioEntry)
                  showingPopover = false
                })
            } catch {
              print("error when removing from portfolio \(error)")
            }
          } label: {
            Text("Yes")
              .roboto(size: 20, weight: .bold)
              .padding()
              .overlay(
                RoundedRectangle(cornerRadius: 10)
                  .stroke(.white, lineWidth: 3)
                  .frame(width: 120)
              )
              .frame(width: 120)
              .cornerRadius(10)
          }
        }
        .padding(.top, 30)
      }
      .padding(30)
    }
    .background(.white.opacity(0))
    .frame(maxWidth: .infinity, maxHeight: .infinity)
  }
}

/*struct RemovePopover_Previews: PreviewProvider {
    static var previews: some View {
        RemovePopover(stockName: "Apple", showingPopover: .constant(true))
    }
}*/
