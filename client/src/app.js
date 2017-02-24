export class App {
    configureRouter(config, router) {
        config.title = 'Aurelia';
        var navStrat = (instruction) => {
            instruction.config.moduleId = instruction.fragment;
            instruction.config.href = instruction.fragment;
        };
        config.map([{
            route: ['', 'competition'],
            name: 'competition',
            moduleId: './components/competition/competition',
            nav: true,
            title: 'Competition'
        }, {
            route: 'debug',
            name: 'debug',
            moduleId: './components/debug/debug',
            nav: true,
            title: 'Debug'
        }]);
        this.router = router;
    }
}
