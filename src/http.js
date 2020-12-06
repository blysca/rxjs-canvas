import { EMPTY, fromEvent } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const url = 'https://api.github.com/search/users?q='

const search = document.getElementById( 'search' )
const result = document.getElementById( 'result' )

const stream$ = fromEvent( search, 'input' )
  .pipe(
    map( ev => ev.target.value ),
    debounceTime( 750 ),
    distinctUntilChanged(),
    tap(() => result.innerHTML = ''),
    filter(value => value.trim()),
    switchMap( value => ajax.getJSON( url + value ).pipe(
      catchError(err => EMPTY)
    ) ),
    map( response => response.items ),
    mergeMap( items => items )
  )

stream$.subscribe( user => {
  // console.log( 'VALUE', ' => ', user )
  const html = `
      <div class="card">
        <div class="card-image">
          <img src="${ user.avatar_url }" alt="">
          <span class="card-title">${ user.login }</span>
        </div>
        <div class="card-action">
          <a href="${user.html_url}" target="_blank">Open github</a>
        </div>
      </div>
`
  result.insertAdjacentHTML( 'beforeend', html )
} )
