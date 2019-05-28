import Reporter from '../Reporter';

const silentReporter: Reporter = {
  colorOutput: true,
  startSeedCollection(collectionName: string) {
    /**/
  },
  endSeedCollection(collectionName: string) {
    /**/
  },
  didHandleRecord(action: string, collectionName: string, id: string) {
    /**/
  }
};

export default silentReporter;
