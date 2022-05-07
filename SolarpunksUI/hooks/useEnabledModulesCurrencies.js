import { gql, useQuery } from "@apollo/client";

const ENABLED_CURRENCIES = gql`
  query {
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`;

export const useEnabledModulesCurrencies = () => {
  const { data, error, loading } = useQuery(ENABLED_CURRENCIES);

  error && console.error("enabledModuleCurrencies error: ", error);

  return {
    enabledCurrencies: data?.enabledModuleCurrencies,
    enabledCurrenciesLoading: loading,
  };
};
