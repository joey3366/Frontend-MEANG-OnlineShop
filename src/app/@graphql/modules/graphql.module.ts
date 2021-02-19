import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';


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
    const link = ApolloLink.from([errorLink, httpLink.create({uri})]);

    apollo.create({link, cache: new InMemoryCache()});
  }
}
