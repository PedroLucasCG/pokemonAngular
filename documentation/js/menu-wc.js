'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">poke-app documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CatalogComponent.html" data-type="entity-link" >CatalogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DetailsComponent.html" data-type="entity-link" >DetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PokedexComponent.html" data-type="entity-link" >PokedexComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CookieService.html" data-type="entity-link" >CookieService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PokemonService.html" data-type="entity-link" >PokemonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PokemonSpeciesService.html" data-type="entity-link" >PokemonSpeciesService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Ability.html" data-type="entity-link" >Ability</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Ability-1.html" data-type="entity-link" >Ability</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EvolutionNode.html" data-type="entity-link" >EvolutionNode</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FlavorTextEntry.html" data-type="entity-link" >FlavorTextEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PokeApiResponse.html" data-type="entity-link" >PokeApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PokeApiResponse-1.html" data-type="entity-link" >PokeApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PokeApiShortResponse.html" data-type="entity-link" >PokeApiShortResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PokeData.html" data-type="entity-link" >PokeData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PokeDataEvolution.html" data-type="entity-link" >PokeDataEvolution</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PokeDataWithArtwork.html" data-type="entity-link" >PokeDataWithArtwork</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PokeSpeciesData.html" data-type="entity-link" >PokeSpeciesData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Stats.html" data-type="entity-link" >Stats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Stats-1.html" data-type="entity-link" >Stats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Type.html" data-type="entity-link" >Type</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Type-1.html" data-type="entity-link" >Type</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});