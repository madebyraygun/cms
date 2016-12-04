<?php
/**
 * @link      https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license   https://craftcms.com/license
 */

namespace craft\helpers;

use Craft;
use Symfony\Component\Filesystem\LockHandler;
use yii\base\ErrorException;
use yii\base\InvalidParamException;

/**
 * Class FileHelper
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since  3.0
 */
class FileHelper extends \yii\helpers\FileHelper
{
    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public static function normalizePath($path, $ds = DIRECTORY_SEPARATOR)
    {
        // Is this a UNC network share path?
        $isUnc = (strncmp($path, '//', 2) === 0 || strncmp($path, '\\\\', 2) === 0);

        // Normalize the path
        $path = parent::normalizePath($path, $ds);

        // If it is UNC, add those slashes back in front
        if ($isUnc) {
            $path = $ds.$ds.ltrim($path, $ds);
        }

        return $path;
    }

    /**
     * Sanitizes a filename.
     *
     * @param string $filename the filename to sanitize
     * @param array  $options  options for sanitization. Valid options are:
     *
     * - asciiOnly: boolean, whether only ASCII characters should be allowed. Defaults to false.
     * - separator: string|null, the separator character to use in place of whitespace. defaults to '-'. If set to null, whitespace will be preserved.
     *
     * @return string The cleansed filename
     */
    public static function sanitizeFilename($filename, $options = [])
    {
        $asciiOnly = isset($options['asciiOnly']) ? $options['asciiOnly'] : false;
        $separator = array_key_exists('separator', $options['separator']) ? $options['separator'] : '-';
        $disallowedChars = [
            'â€”',
            'â€“',
            '&#8216;',
            '&#8217;',
            '&#8220;',
            '&#8221;',
            '&#8211;',
            '&#8212;',
            '+',
            '%',
            '^',
            '~',
            '?',
            '[',
            ']',
            '/',
            '\\',
            '=',
            '<',
            '>',
            ':',
            ';',
            ',',
            '\'',
            '"',
            '&',
            '$',
            '#',
            '*',
            '(',
            ')',
            '|',
            '~',
            '`',
            '!',
            '{',
            '}'
        ];

        // Replace any control characters in the name with a space.
        $filename = preg_replace("#\\x{00a0}#siu", ' ', $filename);

        // Strip any characters not allowed.
        $filename = str_replace($disallowedChars, '', strip_tags($filename));

        if (!is_null($separator)) {
            $filename = preg_replace('/(\s|'.preg_quote($separator, '/').')+/u', $separator, $filename);
        }

        // Nuke any trailing or leading .-_
        $filename = trim($filename, '.-_');

        $filename = ($asciiOnly) ? StringHelper::toAscii($filename) : $filename;

        return $filename;
    }

    /**
     * Returns whether a given directory is empty (has no files) recursively.
     *
     * @param string $dir the directory to be checked
     *
     * @return boolean whether the directory is empty
     * @throws InvalidParamException if the dir is invalid
     * @throws ErrorException in case of failure
     */
    public static function isDirectoryEmpty($dir)
    {
        if (!is_dir($dir)) {
            throw new InvalidParamException("The dir argument must be a directory: $dir");
        }

        if (!($handle = opendir($dir))) {
            throw new ErrorException("Unable to open the directory: $dir");
        }

        // It's empty until we find a file
        $empty = true;

        while (($file = readdir($handle)) !== false) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            $path = $dir.DIRECTORY_SEPARATOR.$file;
            if (is_file($path) || !static::isDirectoryEmpty($path)) {
                $empty = false;
                break;
            }
        }

        closedir($handle);

        return $empty;
    }

    /**
     * Tests whether a file/directory is writable.
     *
     * @param string $path the file/directory path to test
     *
     * @return boolean whether the path is writable
     * @throws ErrorException in case of failure
     */
    public static function isWritable($path)
    {
        // If it's a directory, test on a temp sub file
        if (is_dir($path)) {
            return static::isWritable($path.DIRECTORY_SEPARATOR.uniqid(mt_rand()).'.tmp');
        }

        // Remember whether the file already existed
        $exists = file_exists($path);

        if (($f = @fopen($path, 'a')) === false) {
            return false;
        }

        @fclose($f);

        // Delete the file if it didn't exist already
        if (!$exists) {
            static::removeFile($path);
        }

        return true;
    }

    /**
     * Writes contents to a file.
     *
     * @param string $file     the file path
     * @param string $contents the new file contents
     * @param array $options   options for file write. Valid options are:
     *
     * - createDirs: boolean, whether to create parent directories if they do
     *   not exist. Defaults to true.
     * - append: boolean, whether the contents should be appended to the
     *   existing contents. Defaults to false.
     * - lock: boolean, whether a file lock should be used. Defaults to the
     *   "useWriteFileLock" config setting.
     *
     * @throws InvalidParamException if the parent directory doesn't exist and options[createDirs] is false
     * @throws ErrorException in case of failure
     */
    public static function writeToFile($file, $contents, $options = [])
    {
        $file = static::normalizePath($file);
        $dir = dirname($file);

        if (!is_dir($dir)) {
            if (!isset($options['createDirs']) || $options['createDirs']) {
                static::createDirectory($dir);
            } else {
                throw new InvalidParamException("Cannot write to \"{$file}\" because the parent directory doesn't exist.");
            }
        }

        if (isset($options['lock'])) {
            $lock = (bool) $options['lock'];
        } else {
            $lock = Craft::$app->getConfig()->getUseWriteFileLock();
        }

        if ($lock) {
            $lockHandler = new LockHandler($file.'.lock');
            $lockHandler->lock();
        }

        $flags = 0;
        if (!empty($options['append'])) {
            $flags |= FILE_APPEND;
        }

        if (file_put_contents($file, $contents, $flags) === false) {
            throw new ErrorException("Unable to write new contents to \"{$file}\".");
        }

        if (isset($lockHandler)) {
            $lockHandler->release();
        }
    }

    /**
     * Removes a file.
     *
     * @param string $file the file to be deleted
     *
     * @throws ErrorException in case of failure
     */
    public static function removeFile($file)
    {
        // Copied from [[removeDirectory()]]
        try {
            unlink($file);
        } catch (ErrorException $e) {
            if (DIRECTORY_SEPARATOR === '\\') {
                // last resort measure for Windows
                $lines = [];
                exec("DEL /F/Q \"$file\"", $lines, $deleteError);
            } else {
                throw $e;
            }
        }
    }

    /**
     * Removes all of a directory’s contents recursively.
     *
     * @param string $dir     the directory to be deleted recursively.
     * @param array  $options options for directory remove. Valid options are:
     *
     * - traverseSymlinks: boolean, whether symlinks to the directories should be traversed too.
     *   Defaults to `false`, meaning the content of the symlinked directory would not be deleted.
     *   Only symlink would be removed in that default case.
     *
     * @return void
     * @throws InvalidParamException if the dir is invalid
     * @throws ErrorException in case of failure
     */
    public static function clearDirectory($dir, $options = [])
    {
        if (!is_dir($dir)) {
            throw new InvalidParamException("The dir argument must be a directory: $dir");
        }

        // Copied from [[removeDirectory()]] minus the root directory removal at the end
        if (!($handle = opendir($dir))) {
            return;
        }
        while (($file = readdir($handle)) !== false) {
            if ($file === '.' || $file === '..') {
                continue;
            }
            $path = $dir.DIRECTORY_SEPARATOR.$file;
            if (is_dir($path)) {
                static::removeDirectory($path, $options);
            } else {
                static::removeFile($path);
            }
        }
        closedir($handle);
    }
}
