//
//  PortfolioView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import Foundation
import SwiftUI

struct PortfolioLoadedView: View {
  @ObservedObject var portfolio: Portfolio

  var body: some View {
    VStack(alignment: .leading) {
      VStack {
        HStack {
          Text("Your balance")
            .font(.custom("Roboto", size: 25))
            .fontWeight(.regular)
            .foregroundColor(Color.white)
          Spacer()
        }
        HStack {
          Text(String(format: "%.2f€", portfolio.totalValue()))
            .font(.custom("Roboto", size: 40))
            .fontWeight(.bold)
            .foregroundColor(AppColors.PRIMARY)
          Spacer()
          NavigationLink(
            destination: AddStocksView(portfolio: portfolio).navigationTitle(
              "Add Stock")
          ) {
            Label("add", systemImage: "plus.circle")
              .font(.system(size: 50)).fontWeight(.ultraLight)
              .foregroundColor(AppColors.PRIMARY)
              .labelStyle(.iconOnly)
          }
        }
      }.padding()
      ZStack {
        Rectangle()
          .fill(.white)
          .opacity(0.15)
          .frame(maxWidth: .infinity)
          .cornerRadius(radius: 40.0, corners: [.topLeft, .topRight])
          .ignoresSafeArea()
        if portfolio.isEmpty() {
          Text("Your portfolio is empty, add a ").foregroundColor(Color.white)
        } else {
          PieChart(
            portfolio: portfolio,
            separatorColor: Color(UIColor.systemBackground),
            innerColor: .black,
            accentColors: pieColors
          ).padding()
        }
      }
    }
    .navigationTitle("Portfolio")
    .foregroundColor(.white)
  }

}

struct PortfolioView: View {
  var portfolioLoader = PortfolioLoader()

  var body: some View {
    NavigationView {
      ZStack {
        AppColors.BACKGROUND.ignoresSafeArea()
        AsyncContentView(
          loadable: portfolioLoader,
          loadingView: ProgressView("Loading Portfolio..").tint(.white).foregroundColor(Color.white)
        ) { portfolio in
          PortfolioLoadedView(portfolio: portfolio)
        }

      }
    }
  }
}

struct PortfolioView_Previews: PreviewProvider {
  static var previews: some View {
    PortfolioView()
      .environmentObject(ModelData())
  }
}
