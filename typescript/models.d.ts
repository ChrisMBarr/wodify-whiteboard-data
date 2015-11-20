interface IWodComponents {
  name: string;
  description: string;
}

interface IWodPerfomancePartsTime {
  time_minutes: number;
  time_seconds: number;
  total_seconds: number;
}

interface IWodPerfomancePartsWeight {
  weight: number;
  units: string;
  rounds?: number;
  reps?: number;
}

interface IWodPerfomancePartsReps {
  rounds?: number;
  reps: number;
  units?: string;
}

interface IAthleteBadges {
  isPr: boolean;
  prDetails: string;
  isRx: boolean;
  isRxPlus: boolean;
}

interface IAthleteSocial {
  likesCount: number;
  commentsCount: number;
}

interface IAthlete {
  name: string;
  avatar: string;
  rank: number;
  class_info: string;
  performance_string: string;
  performance_parts: IWodPerfomancePartsTime | IWodPerfomancePartsWeight | IWodPerfomancePartsReps,
  performance_details: string[],
  comment: string;
  pr: boolean;
  pr_details: string;
  rx: boolean;
  rx_plus: boolean;
  social_likes: number;
  social_comments: number;
}

interface IWodResults {
  males: IAthlete[];
  females: IAthlete[];
}

interface IWodData {
  date: string;
  name: string;
  comment: string;
  components: IWodComponents[],
  results_measure: string;
  results: IWodResults;
}