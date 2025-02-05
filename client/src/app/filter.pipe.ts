import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(users: any[], searchText: string): any[] {
    if (!users || !searchText) {
      return users; 
    }

    searchText = searchText.toLowerCase();

    return users.filter(user =>
      user.name.toLowerCase().startsWith(searchText)
    );
  }
}
