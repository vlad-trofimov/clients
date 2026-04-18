import { Component, ChangeDetectionStrategy, Inject } from "@angular/core";

import { DrawerDetails, DrawerType } from "@bitwarden/bit-common/dirt/reports/risk-insights";
import { MemberDetails } from "@bitwarden/bit-common/dirt/reports/risk-insights/models/report-models";
import { FileDownloadService } from "@bitwarden/common/platform/abstractions/file-download/file-download.service";
import { I18nService } from "@bitwarden/common/platform/abstractions/i18n.service";
import {
  BadgeModule,
  ButtonModule,
  DIALOG_DATA,
  DialogModule,
  IconModule,
  LinkModule,
  TooltipDirective,
} from "@bitwarden/components";
import { LogService } from "@bitwarden/logging";
import { I18nPipe } from "@bitwarden/ui-common";
import { ExportHelper } from "@bitwarden/vault-export-core";
import { exportToCSV } from "@bitwarden/web-vault/app/dirt/reports/report-utils";

import { getMemberSubcategoryBadges } from "./subcategory-badge.utils";

@Component({
  imports: [
    BadgeModule,
    ButtonModule,
    DialogModule,
    IconModule,
    I18nPipe,
    LinkModule,
    TooltipDirective,
  ],
  templateUrl: "./risk-insights-drawer-dialog.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RiskInsightsDrawerDialogComponent {
  constructor(
    @Inject(DIALOG_DATA) readonly drawerDetails: DrawerDetails,
    private readonly fileDownloadService: FileDownloadService,
    private readonly i18nService: I18nService,
    private readonly logService: LogService,
  ) {}

  // Get a list of drawer types
  get drawerTypes(): typeof DrawerType {
    return DrawerType;
  }

  isActiveDrawerType(type: DrawerType): boolean {
    return this.drawerDetails.activeDrawerType === type;
  }

  protected getMemberSubcategoryBadges(
    member: MemberDetails,
  ): ReturnType<typeof getMemberSubcategoryBadges> {
    return getMemberSubcategoryBadges(member, (key) => this.i18nService.t(key));
  }

  /**
   * downloads at risk members as CSV
   */
  downloadAtRiskMembers() {
    try {
      // Validate drawer is open and showing the correct drawer type
      if (
        !this.drawerDetails.open ||
        this.drawerDetails.activeDrawerType !== DrawerType.OrgAtRiskMembers ||
        !this.drawerDetails.atRiskMemberDetails ||
        this.drawerDetails.atRiskMemberDetails.length === 0
      ) {
        return;
      }

      this.fileDownloadService.download({
        fileName: ExportHelper.getFileName("at-risk-members"),
        blobData: exportToCSV(this.drawerDetails.atRiskMemberDetails, {
          email: this.i18nService.t("email"),
          atRiskPasswordCount: this.i18nService.t("atRiskPasswords"),
        }),
        blobOptions: { type: "text/plain" },
      });
    } catch (error) {
      // Log error for debugging
      this.logService.error("Failed to download at-risk members", error);
    }
  }

  /**
   * downloads at risk applications as CSV
   */
  downloadAtRiskApplications() {
    try {
      // Validate drawer is open and showing the correct drawer type
      if (
        !this.drawerDetails.open ||
        this.drawerDetails.activeDrawerType !== DrawerType.OrgAtRiskApps ||
        !this.drawerDetails.atRiskAppDetails ||
        this.drawerDetails.atRiskAppDetails.length === 0
      ) {
        return;
      }

      this.fileDownloadService.download({
        fileName: ExportHelper.getFileName("at-risk-applications"),
        blobData: exportToCSV(this.drawerDetails.atRiskAppDetails, {
          applicationName: this.i18nService.t("application"),
          atRiskPasswordCount: this.i18nService.t("atRiskPasswords"),
        }),
        blobOptions: { type: "text/plain" },
      });
    } catch (error) {
      // Log error for debugging
      this.logService.error("Failed to download at-risk applications", error);
    }
  }
}
