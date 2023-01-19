//
//  LoadingState.swift
//  Stocks
//
//  Created by Jan Honsbrok on 04.11.22.
//

import Combine
import Foundation
import SwiftUI

enum LoadingState<Value> {
  case idle
  case loading
  case failed(Error)
  case loaded(Value)
}

protocol LoadableObject: ObservableObject {
  associatedtype Output
  var state: LoadingState<Output> { get }
  func load()
}

class PublishedObject<Wrapped: Publisher>: LoadableObject {
  @Published private(set) var state = LoadingState<Wrapped.Output>.idle

  private let publisher: Wrapped
  private var cancellable: AnyCancellable?

  init(publisher: Wrapped) {
    self.publisher = publisher
  }

  func load() {
    state = .loading

    cancellable =
      publisher
      .map(LoadingState.loaded)
      .catch { error in
        Just(LoadingState.failed(error))
      }
      .sink { [weak self] state in
        self?.state = state
      }
  }
}

struct ErrorView: View {
  var error: Error
  // TODO retry callback
  var body: some View {
    VStack(alignment: .leading) {
      HStack {
        Image(systemName: "figure.fall").font(.system(size: 40))
        Text("An error has occured").bold()
      }
      Divider()
      Text(error.localizedDescription)
    }.padding(20)
  }
}

struct AsyncContentView<Loadable: LoadableObject, LoadingView: View, Content: View>: View {
  @ObservedObject var loadable: Loadable
  var loadingView: LoadingView
  var content: (Loadable.Output) -> Content

  init(
    loadable: Loadable,
    loadingView: LoadingView,
    @ViewBuilder content: @escaping (Loadable.Output) -> Content
  ) {
    self.loadable = loadable
    self.loadingView = loadingView
    self.content = content
  }

  var body: some View {
    switch loadable.state {
    case .idle:
      Color.clear.onAppear(perform: loadable.load)
    case .loading:
      self.loadingView
    case .failed(let error):
      ErrorView(error: error)
    case .loaded(let output):
      content(output)
    }
  }
}

struct AsyncContentView_Previews: PreviewProvider {
  class DummyLoadable: LoadableObject {
    @Published private(set) var state: LoadingState<String>

    init(state: LoadingState<String>) {
      self.state = state
    }

    func load() {

    }
  }
  enum DemoError: Error {
    case error(String)
  }

  static var previews: some View {
    AsyncContentView(loadable: DummyLoadable(state: .idle), loadingView: ProgressView()) { stocks in
      Text("hello")
    }.previewDisplayName("idle")

    AsyncContentView(loadable: DummyLoadable(state: .loading), loadingView: ProgressView()) {
      stocks in
      Text("hello")
    }.previewDisplayName("loading")

    AsyncContentView(
      loadable: DummyLoadable(state: .loaded("the loaded text")), loadingView: ProgressView()
    ) { stocks in
      Text("hello")
    }.previewDisplayName("loaded")

    AsyncContentView(
      loadable: DummyLoadable(state: .failed(DemoError.error("error message"))),
      loadingView: ProgressView()
    ) { stocks in
      Text("hello")
    }.previewDisplayName("failed")
  }
}
