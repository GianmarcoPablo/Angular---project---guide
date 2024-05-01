import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { v4 as uuid } from "uuid"
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl(""),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  });

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;
    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.heroesService.getHeroById(id))
    ).subscribe(hero => {
      if (!hero) return this.router.navigateByUrl('/heroes/new');
      this.heroForm.patchValue(hero);
      return
    })
  }

  onSubmit() {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe(hero => {
        this.showSnackBar(`Hero ${hero.superhero} updated`);
        this.router.navigateByUrl('/heroes/list');
      })
      return;
    }

    this.heroesService.addHero(
      {
        ...this.currentHero,
        id: uuid()
      }
    ).subscribe(hero => {
      this.showSnackBar(`Hero ${hero.superhero} created`);
      this.router.navigateByUrl('/heroes/edit/' + hero.id);
    })
  }

  onDeleteHero() {
    if (!this.currentHero.id) return;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value.superhero
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroesService.deleteHeroById(this.currentHero.id).subscribe((wasDeleted) => {
          if (wasDeleted) {
            this.showSnackBar(`Hero ${this.currentHero.superhero} deleted`);
            this.router.navigateByUrl('/heroes/list');
          }
        })
      }
    })
  }


  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Ok!', {
      duration: 2500
    })
  }
}
