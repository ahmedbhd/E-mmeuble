import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {StartPage} from '../pages/start/start';
import {timer} from "rxjs/observable/timer";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = StartPage;
  showSplash = true;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen
              // ,private config: Config
  ) {
    this.setCustomTransitions();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      timer(3000).subscribe(() => this.showSplash = false);
    });
  }

  setCustomTransitions() {
    // this.config.setTransition('custom-popover-enter', PopoverEnterTransition);
  }
}
