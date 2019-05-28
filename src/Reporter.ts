interface Reporter {
  colorOutput: boolean;
  startSeedCollection: (collectionName: string) => void,
  endSeedCollection: (collectionName: string) => void,
  didHandleRecord: (action: string, collectionName: string, id: string) => void
}

export default Reporter;
