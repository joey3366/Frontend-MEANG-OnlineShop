import { SHOP_PRODUCT_FRAGMENT } from './../fragment/shop-product';
import { RESULT_INFO_FRAGMENT } from '@graphql/operations/fragment/result-info';
import gql from 'graphql-tag';
export const SHOP_LAST_UNITS_OFFERS = gql`
  query ProductosPorOferta(
    $page: Int
    $itemsPage: Int
    $active: ActiveFilterEnum
    $random: Boolean
    $topPrice: Float
    $lastUnits: Int
  ) {
    shopProductsOffersLast(
      page: $page
      itemsPage: $itemsPage
      active: $active
      random: $random
      topPrice: $topPrice
      lastUnits: $lastUnits
    ) {
      info {
        ...ResultInfoObject
      }
      status
      message
      shopProducts {
       ...ShopProductObject
      }
    }
  }
  ${SHOP_PRODUCT_FRAGMENT}
  ${RESULT_INFO_FRAGMENT}
`;

export const SHOP_PRODUCT_BY_PLATFORM = gql`
  query ProductosPorPlataforma(
    $page: Int
    $itemsPage: Int
    $active: ActiveFilterEnum
    $random: Boolean
    $platform: ID!
  ) {
    shopProductsPlatforms(
      page: $page
      itemsPage: $itemsPage
      active: $active
      random: $random
      platform: $platform
    ) {
      status
      message
      shopProducts {
        ...ShopProductObject
      }
    }
  }
  ${SHOP_PRODUCT_FRAGMENT}
`;
