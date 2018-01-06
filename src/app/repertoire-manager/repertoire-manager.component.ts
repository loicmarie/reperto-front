import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Repertoire } from '../repertoire';
import { RepertoireService } from '../repertoire.service';
import { Variant } from '../variant';

@Component({
  selector: 'app-repertoire-manager',
  templateUrl: './repertoire-manager.component.html',
  styleUrls: ['./repertoire-manager.component.css']
})
export class RepertoireManagerComponent implements OnInit {

  variants: Variant[];
  repertoires: Repertoire[];
  repertoire: Repertoire;

  isSaving: Boolean = false;
  isAdding: Boolean = false;
  isDeleting: Boolean = false;

  constructor(private userService: UserService,
    private auth: AuthService,
    private repService: RepertoireService) {

    auth.handleAuthentication().subscribe(user => {
      this.listRepertoires();
    }, error => {});
  }

  listRepertoires() {
    this.variants = this.auth.user.variants;
    this.repertoires = this.auth.user.repertoires;
    if (this.repertoires.length != 0)
      this.repertoire = this.repertoires[0];
    else
      this.repertoire = undefined;
  }

  selectRepertoire(repertoire: Repertoire) {
    this.repertoire = repertoire;
  }

  addRepertoire() {
    this.repService.new().subscribe(repertoire => {
      this.auth.user.repertoires.push(repertoire);
      this.userService.update(this.auth.user).subscribe();
    });
  }

  deleteRepertoire() {
    this.isDeleting = true;
    this.repService.delete(this.repertoire).subscribe(() => {
      this.auth.user.repertoires.splice(this.auth.user.repertoires.indexOf(this.repertoire),1);
      this.userService.update(this.auth.user).subscribe(() => {
        this.listRepertoires()
        setTimeout(() => {
          this.isDeleting = false;
        }, 500);
      });
    });
  }

  updateRepertoire() {
    this.isSaving = true;
    this.repService.update(this.repertoire).subscribe(() =>
      setTimeout(() => {
        this.isSaving = false
      }, 500)
    );
  }

  ngOnInit() {
  }

}
