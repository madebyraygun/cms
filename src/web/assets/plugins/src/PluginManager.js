import './plugins.scss';

(function ($) {
  /** global: Craft */
  /** global: Garnish */
  Craft.PluginManager = Garnish.Base.extend(
    {
      init: function () {
        this.getPluginLicenseInfo().then((response) => {
          for (let handle in response) {
            if (response.hasOwnProperty(handle)) {
              if (!response[handle].isComposerInstalled) {
                this.addUninstalledPluginRow(handle, response[handle]);
              } else {
                new Plugin(this, $('#plugin-' + handle)).update(
                  response[handle]
                );
              }
            }
          }
        });
      },

      getPluginLicenseInfo: function () {
        return new Promise(function (resolve, reject) {
          Craft.sendApiRequest('GET', 'cms-licenses', {
            params: {
              include: 'plugins',
            },
          })
            .then((response) => {
              let data = {
                pluginLicenses: response.license.pluginLicenses || [],
              };
              Craft.sendActionRequest('POST', 'app/get-plugin-license-info', {
                data,
              })
                .then((response) => {
                  resolve(response.data);
                })
                .catch(() => {
                  reject();
                });
            })
            .catch(reject);
        });
      },

      addUninstalledPluginRow: function (handle, info) {
        const $table = $('#plugins');
        if (!$table.length) {
          $table = $('<table/>', {
            id: 'plugins',
            class: 'data fullwidth collapsible',
            html: '<tbody></tbody>',
          });
          $('#no-plugins').replaceWith($table);
        }

        const $row = $('<tr/>', {
          data: {
            handle: handle,
          },
        })
          .appendTo($table.children('tbody'))
          .append(
            $('<th/>').append(
              $('<div/>', {class: 'plugin-infos'})
                .append(
                  $('<div/>', {class: 'icon'}).append(
                    $('<img/>', {src: info.iconUrl})
                  )
                )
                .append(
                  $('<div/>', {class: 'plugin-details'})
                    .append($('<h2/>', {text: info.name}))
                    .append(
                      info.description
                        ? $('<p/>', {text: info.description})
                        : $()
                    )
                    .append(
                      info.documentationUrl
                        ? $('<p/>', {class: 'links'}).append(
                            $('<a/>', {
                              href: info.documentationUrl,
                              target: '_blank',
                              text: Craft.t('app', 'Documentation'),
                            })
                          )
                        : $()
                    )
                    .append(
                      $('<div/>', {class: 'flex license-key'}).append(
                        $('<div />', {class: 'pane'}).append(
                          $('<input/>', {
                            class: 'text code',
                            size: 29,
                            maxlength: 29,
                            value: Craft.PluginManager.normalizeUserKey(
                              info.licenseKey
                            ),
                            readonly: true,
                            disabled: true,
                          })
                        )
                      )
                    )
                )
            )
          )
          .append(
            $('<td/>', {
              class: 'nowrap',
              'data-title': Craft.t('app', 'Status'),
            })
              .append($('<span/>', {class: 'status disabled'}))
              .append(
                $('<span/>', {class: 'light', text: Craft.t('app', 'Missing')})
              )
          )
          .append(
            info.latestVersion
              ? $('<td/>', {
                  class: 'nowrap thin',
                  'data-title': Craft.t('app', 'Action'),
                }).append(
                  $('<form/>', {
                    method: 'post',
                    'accept-charset': 'UTF-8',
                  })
                    .append(
                      $('<input/>', {
                        type: 'hidden',
                        name: 'action',
                        value: 'pluginstore/install',
                      })
                    )
                    .append(
                      $('<input/>', {
                        type: 'hidden',
                        name: 'packageName',
                        value: info.packageName,
                      })
                    )
                    .append(
                      $('<input/>', {
                        type: 'hidden',
                        name: 'handle',
                        value: handle,
                      })
                    )
                    .append(
                      $('<input/>', {
                        type: 'hidden',
                        name: 'edition',
                        value: info.licensedEdition,
                      })
                    )
                    .append(
                      $('<input/>', {
                        type: 'hidden',
                        name: 'version',
                        value: info.latestVersion,
                      })
                    )
                    .append(
                      $('<input/>', {
                        type: 'hidden',
                        name: 'licenseKey',
                        value: info.licenseKey,
                      })
                    )
                    .append(
                      $('<input/>', {
                        type: 'hidden',
                        name: 'return',
                        value: 'settings/plugins',
                      })
                    )
                    .append(Craft.getCsrfInput())
                    .append(
                      $('<button/>', {
                        type: 'button',
                        class: 'btn menubtn action-btn hairline',
                      })
                    )
                    .append(
                      $('<div/>', {
                        class: 'menu',
                        'data-align': 'right',
                      }).append(
                        $('<ul/>').append(
                          $('<li/>').append(
                            $('<a/>', {
                              class: 'formsubmit',
                              text: Craft.t('app', 'Install'),
                            })
                          )
                        )
                      )
                    )
                )
              : $()
          );
        Craft.initUiElements($row);
      },
    },
    {
      normalizeUserKey: function (key) {
        if (typeof key !== 'string' || key === '') {
          return '';
        }
        if (key[0] === '$') {
          return key;
        }
        return key.replace(/.{4}/g, '$&-').substring(0, 29).toUpperCase();
      },
    }
  );

  const Plugin = Garnish.Base.extend({
    manager: null,
    $row: null,
    $details: null,
    $keyContainer: null,
    $keyInput: null,
    $spinner: null,
    $buyBtn: null,
    handle: null,
    updateTimeout: null,

    init: function (manager, $row) {
      this.manager = manager;
      this.$row = $row;
      this.$details = this.$row.find('.plugin-details');
      this.$keyContainer = $row.find('.license-key');
      this.$keyInput = this.$keyContainer
        .find('input.text')
        .removeAttr('readonly');
      this.$buyBtn = this.$keyContainer.find('.btn');
      this.$spinner = $row.find('.spinner');
      this.handle = this.$row.data('handle');
      this.addListener(this.$keyInput, 'focus', 'onKeyFocus');
      this.addListener(this.$keyInput, 'input', 'onKeyChange');
    },

    getKey: function () {
      return this.$keyInput.val().replace(/\-/g, '').toUpperCase();
    },

    onKeyFocus: function () {
      this.$keyInput.select();
    },

    onKeyChange: function () {
      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
      }
      const key = this.getKey();
      if (
        key.length === 0 ||
        key.length === 24 ||
        (key.length > 1 && key[0] === '$')
      ) {
        // normalize
        const userKey = Craft.PluginManager.normalizeUserKey(key);
        this.$keyInput.val(userKey);
        this.updateTimeout = setTimeout(
          this.updateLicenseStatus.bind(this),
          100
        );
      }
    },

    updateLicenseStatus: function () {
      this.$spinner.removeClass('hidden');

      let data = {handle: this.handle, key: this.getKey()};
      Craft.sendActionRequest('POST', 'app/update-plugin-license', {data}).then(
        () => {
          this.manager.getPluginLicenseInfo().then((response) => {
            this.$spinner.addClass('hidden');
            this.update(response[this.handle]);
          });
        }
      );
    },

    update: function (info) {
      // update the status icon
      const $oldIcon = this.$row.find('.license-key-status');
      if (info.licenseKeyStatus == 'valid' || info.licenseIssues.length) {
        const $newIcon = $('<span/>', {
          class:
            'license-key-status ' +
            (info.licenseIssues.length === 0 ? 'valid' : ''),
        });
        if ($oldIcon.length) {
          $oldIcon.replaceWith($newIcon);
        } else {
          $newIcon.appendTo(this.$row.find('.icon'));
        }
      } else if ($oldIcon.length) {
        $oldIcon.remove();
      }

      // add the edition/trial badge
      const $oldEdition = this.$row.find('.edition');
      if (info.hasMultipleEditions || info.isTrial) {
        const $newEdition = info.upgradeAvailable
          ? $('<a/>', {
              href: Craft.getUrl('plugin-store/' + this.handle),
              class: 'edition',
            })
          : $('<div/>', {class: 'edition'});
        if (info.hasMultipleEditions) {
          $('<div/>', {class: 'edition-name', text: info.edition}).appendTo(
            $newEdition
          );
        }
        if (info.isTrial) {
          $('<div/>', {
            class: 'edition-trial',
            text: Craft.t('app', 'Trial'),
          }).appendTo($newEdition);
        }
        if ($oldEdition.length) {
          $oldEdition.replaceWith($newEdition);
        } else {
          $newEdition.insertBefore(this.$row.find('.version'));
        }
      } else if ($oldEdition.length) {
        $oldEdition.remove();
      }

      // show the license key?
      const showLicenseKey =
        info.licenseKey || info.licenseKeyStatus !== 'unknown';
      if (showLicenseKey) {
        this.$keyContainer.removeClass('hidden');
        if (info.licenseKey && !this.$keyInput.val().match(/^\$/)) {
          this.$keyInput.val(
            Craft.PluginManager.normalizeUserKey(info.licenseKey)
          );
        }
      } else {
        this.$keyContainer.addClass('hidden');
      }

      // update the license key input class
      if (showLicenseKey && info.licenseIssues.length) {
        this.$keyInput.addClass('error');
      } else {
        this.$keyInput.removeClass('error');
      }

      // add the error message
      this.$row.find('p.error').remove();
      if (info.licenseIssues.length) {
        let $issues = $();
        for (let i = 0; i < info.licenseIssues.length; i++) {
          let message;
          switch (info.licenseIssues[i]) {
            case 'no_trials':
              message = Craft.t(
                'app',
                'Plugin trials are not allowed on this domain.'
              );
              break;
            case 'wrong_edition':
              message =
                Craft.t('app', 'This license is for the {name} edition.', {
                  name:
                    info.licensedEdition.charAt(0).toUpperCase() +
                    info.licensedEdition.substring(1),
                }) +
                ' <button type="button" class="btn submit small formsubmit">' +
                Craft.t('app', 'Switch') +
                '</button>';
              break;
            case 'mismatched':
              message = Craft.t(
                'app',
                'This license is tied to another Craft install. Visit {accountLink} to detach it, or <a href="{buyUrl}">buy a new license</a>',
                {
                  accountLink:
                    '<a href="https://console.craftcms.com" rel="noopener" target="_blank">console.craftcms.com</a>',
                  buyUrl: Craft.getCpUrl(
                    `plugin-store/buy/${this.handle}/${info.edition}`
                  ),
                }
              );
              break;
            case 'astray':
              message = Craft.t(
                'app',
                'This license isn’t allowed to run version {version}.',
                {
                  version: info.version,
                }
              );
              break;
            case 'required':
              message = Craft.t('app', 'A license key is required.');
              break;
            default:
              message = Craft.t('app', 'Your license key is invalid.');
          }

          const $p = $('<p/>', {class: 'error', html: message});
          if (info.licenseIssues[i] === 'wrong_edition') {
            const $form = $('<form/>', {
              method: 'post',
              'accept-charset': 'UTF-8',
            })
              .append(Craft.getCsrfInput())
              .append(
                $('<input/>', {
                  type: 'hidden',
                  name: 'action',
                  value: 'plugins/switch-edition',
                })
              )
              .append(
                $('<input/>', {
                  type: 'hidden',
                  name: 'pluginHandle',
                  value: this.handle,
                })
              )
              .append(
                $('<input/>', {
                  type: 'hidden',
                  name: 'edition',
                  value: info.licensedEdition,
                })
              )
              .append($p);

            Craft.initUiElements($form);
            $issues = $issues.add($form);
          } else {
            $issues = $issues.add($p);
          }
        }
        $issues.appendTo(this.$details);
        Craft.initUiElements();
      }

      // add the expired badge
      var $oldExpired = this.$row.find('.expired');
      if (info.expired) {
        var $newExpired = $('<p/>', {
          class: 'warning with-icon expired',
          html:
            Craft.t('app', 'This license has expired.') +
            ' ' +
            Craft.t(
              'app',
              '<a>Renew now</a> for another year of updates.'
            ).replace(
              '<a>',
              '<a href="' + info.renewalUrl + '" target="_blank">'
            ),
        });
        if ($oldExpired.length) {
          $oldExpired.replaceWith($newExpired);
        } else {
          $newExpired.appendTo(this.$details);
        }
      }

      // show/hide the Buy button
      if (info.licenseKeyStatus === 'trial') {
        this.$buyBtn.removeClass('hidden');
        if (info.licenseIssues.length) {
          this.$buyBtn.addClass('submit');
        } else {
          this.$buyBtn.removeClass('submit');
        }
      } else {
        this.$buyBtn.addClass('hidden');
      }
    },
  });
})(jQuery);
