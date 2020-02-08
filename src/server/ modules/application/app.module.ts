import { AppController } from './app.controller';
import { Container, Service } from 'typedi';
import { Application } from './application';
import { instantiate } from '../../utils/utils';
import { modelsProviders } from '../../models/models.providers';
import { database } from '../../models/database';

@Service()
export class ApplicationModule {
  constructor(private appController: AppController) {}

  init(app: Application) {
    // let tokens = Reflect.getMetadata('design:paramtypes', target) || [],
    app.addControllers([this.appController]);
  }

  static async create(app: Application): Promise<ApplicationModule> {
    console.log('[APP] Creating Application');
    try {
      database.connect().then(() => console.log('[APP] Database connected'));

      await instantiate(modelsProviders);

      const appModule = Container.get(ApplicationModule);

      appModule.init(app);

      return appModule;
    } catch (error) {
      console.error('[ERROR]', { error });
      process.exit(-1);
    }
  }
}
