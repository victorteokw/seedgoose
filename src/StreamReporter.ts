import { Writable } from "stream";
import Reporter from './Reporter';

interface StreamReporter extends Reporter {
  stream: Writable;
}

export default StreamReporter;
