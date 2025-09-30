// FIXME: Update this file to be type safe and remove this and next line
// @ts-strict-ignore
import { Component, Input } from "@angular/core";

import { CollectionView } from "@bitwarden/admin-console/common";
import { uuidAsString } from "@bitwarden/common/platform/abstractions/sdk/sdk.service";
import { CollectionId } from "@bitwarden/common/types/guid";

import { SharedModule } from "../../../../shared/shared.module";
import { GetCollectionNameFromIdPipe } from "../pipes";

@Component({
  selector: "app-collection-badge",
  templateUrl: "collection-name-badge.component.html",
  imports: [SharedModule, GetCollectionNameFromIdPipe],
})
export class CollectionNameBadgeComponent {
  @Input() collectionIds: CollectionId[] | string[];
  @Input() collections: CollectionView[];

  get shownCollections(): string[] {
    return (this.showXMore ? this.collectionIds.slice(0, 2) : this.collectionIds).map(uuidAsString);
  }

  get showXMore(): boolean {
    return this.collectionIds.length > 3;
  }

  get xMoreCount(): number {
    return this.collectionIds.length - 2;
  }
}
