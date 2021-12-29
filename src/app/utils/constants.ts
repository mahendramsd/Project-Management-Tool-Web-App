export class Constants {

  static URL = class {
    static readonly LOGIN = '/login';
    static readonly HOME = '/home';
    static readonly SPRINTS = '/home/sprint';
    static readonly PROJECT = '/home/project';
    static readonly PROJECT_ISSUE = '/project/issues';
    static readonly ISSUES = 'issues';

  }

  static API_END_POINTS = class {
    static readonly LOGIN = '/auth/login';
    static readonly USER = '/user';
    static readonly USER_REGISTER = '/user/register';
    static readonly PROJECT = '/project';
    static readonly ISSUE = '/issue';
    static readonly ISSUE_CHANGE = '/issue/change';
    static readonly LOGS = '/issue/logs';
    static readonly ASSIGN = '/issue/assign';

  }

  static LOCAL_STORE_RESOURSES = class {
    static readonly USER = 'user';
    static readonly TOKEN = 'token';
    static readonly USERNAME = 'username';
    static readonly PROJECT_ID = 'project_id';
  }

  
  static ISSUE_STATE = class {
    static readonly OPEN = 'OPEN';
    static readonly IN_PROGRESS = 'IN_PROGRESS';
    static readonly DEPLOY = 'DEPLOY';
  }


}
