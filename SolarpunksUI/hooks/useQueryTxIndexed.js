import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

export const useQueryTxIndexed = (txResponse, txHash) => {
  const {
    loading: isIndexedLoading,
    error: isIndexedError,
    data: isIndexedData,
    startPolling,
    stopPolling,
  } = useQuery(HAS_TX_BEEN_INDEXED, {
    variables: { request: { txHash } },
    fetchPolicy: "network-only",
    ssr: false,
    skip: !txHash,
  });

  useEffect(() => {
    if (txHash) {
      startPolling(1500);
      console.log("Starting polling");
    }
  }, [txResponse]);

  useEffect(() => {
    if (isIndexedData?.hasTxHashBeenIndexed?.indexed) {
      stopPolling();
      console.log("Stop polling");
    }
    // future enhancement. Not affecting hackathon, skip it for now.
    // kind: 'POST' | 'PROFILE'
    // PROFILE: stop polling after Indexed
    // POST: stop polling after Indexed AND Metadatastatus returned
    // const metadataStatus = isIndexedData?.hasTxHashBeenIndexed?.metadataStatus?.status;
    // console.log("metadataStatus", metadataStatus);
    // if (metadataStatus === 1 || metadataStatus === 2) {
    //   stopPolling();
    //   console.log("Stop polling");
    // }
  }, [isIndexedData]);

  // Apollo Error
  isIndexedError && console.error(`fail to retrieve index: ${isIndexedError}`);

  const transactionReceipt = isIndexedData?.hasTxHashBeenIndexed;

  return {
    isIndexedLoading,
    transactionReceipt,
    isIndexedError,
  };
};

const HAS_TX_BEEN_INDEXED = gql`
  query ($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) {
      ... on TransactionIndexedResult {
        indexed
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
        metadataStatus {
          status
          reason
        }
      }
      ... on TransactionError {
        reason
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
      }
      __typename
    }
  }
`;
