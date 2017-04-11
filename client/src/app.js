export class App {
    configureRouter(config, router) {
        config.title = 'Aurelia';

        let navStrat = (instruction) => {
            instruction.config.moduleId = instruction.fragment;
            instruction.config.href = instruction.fragment;
        };

        config.map([
            {
                route: ['', 'debug'],
                name: 'debug',
                moduleId: './components/debug/debug',
                nav: true,
                title: 'Debug'
            }
        ]);

        this.router = router;
    }
}
