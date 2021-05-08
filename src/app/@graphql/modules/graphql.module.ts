import { getMainDefinition } from 'apollo-utilities'
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, split } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { WebSocketLink } from 'apollo-link-ws';
import { environment } from 'src/environments/environment';


@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphqlModule {
  constructor(apollo: Apollo, httpLink: HttpLink){
    const errorLink = onError(({graphQLErrors, networkError}) => {
      // Verificar Errores de graphql
      if (graphQLErrors) {
        console.log('Error Graphql', graphQLErrors);
      }
      // Verificar Errores de red
      if (networkError) {
        console.log('Error', networkError);
      }
    });

    // Link De Conexion de mi API
    const uri = 'http://localhost:3000/graphql';

    // Forma de conectarme a mi API
    const urlLink = ApolloLink.from([errorLink, httpLink.create({uri})]);
    const subscriptionLink = new WebSocketLink({uri: environment.backendWs, options: {reconnect: true}});
    const link = split(({query}) => {
      const {kind, operation}: any = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    }, subscriptionLink, urlLink)
    apollo.create({link, cache: new InMemoryCache()});
  }
}
