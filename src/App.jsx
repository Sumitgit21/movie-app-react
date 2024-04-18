import { useState } from 'react'
import Home from './pages/Home'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();
function App() {

  return (
    <div className="App">
      <QueryClientProvider client={queryClient} >
        <Home />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </div>
  )
}

export default App
