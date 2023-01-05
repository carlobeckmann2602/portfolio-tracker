//
//  PortfolioView.swift
//  Stocks
//
//  Created by Jan Honsbrok on 26.10.22.
//

import Foundation
import SwiftUI

struct EmptyDonut: View {
  var body: some View {
    ZStack {
      Circle()
        .fill(AppColors.BACKGROUND)
        .frame(width: 315, height: 315)
      Circle()
        .fill(AppColors.LIGHT_PURPLE)
        .frame(width: 150, height: 150)
    }
  }
}

struct PortfolioLoadedView: View {
  @ObservedObject var portfolio: Portfolio

  var body: some View {
    VStack(alignment: .leading) {
      VStack {
        HStack {
          Text("Your balance")
            .roboto(size: 25, weight: .regular)
          Spacer()
        }
        HStack {
          Text(String(format: "%.2f€", portfolio.currentPortfolioValue))
            .roboto(size: 40, weight: .bold, foregroundColor: AppColors.PRIMARY)
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
          VStack {
            EmptyDonut().padding(.bottom, 30)
            Text("Tap the plus button to add a new stock.").roboto(
              size: 25, foregroundColor: Color.white
            ).multilineTextAlignment(.center)
          }
        } else {
          PieChart(
            portfolio: portfolio,
            separatorColor: Color(UIColor.systemBackground),
            innerColor: AppColors.LIGHT_PURPLE,
            accentColors: pieColors
          ).padding()
        }
      }
    }
    .navigationTitle("Portfolio")
    .preferredColorScheme(.dark)
  }

}

struct PortfolioView: View {
  var portfolioHandler: PortfolioHandler

  var body: some View {
    NavigationView {
      ZStack {
        AppColors.BACKGROUND.ignoresSafeArea()
        AsyncContentView(
          loadable: PortfolioLoader(portfolioHandler: portfolioHandler),
          loadingView: ProgressView("Loading Portfolio..").tint(.white).foregroundColor(Color.white)
        ) { portfolio in
          PortfolioLoadedView(portfolio: portfolio)
        }

      }
    }
  }
}
